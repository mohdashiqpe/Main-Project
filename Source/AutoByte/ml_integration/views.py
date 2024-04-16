from django.shortcuts import render, HttpResponse, redirect
import os
import tensorflow as tf
from keras.preprocessing.image import load_img, img_to_array
import numpy as np
from django.apps import apps
import pandas as pd
from django.contrib import messages
# PyCharm Import's
import os
import tensorflow as tf
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
import pickle
from ProductApp.models import *
# From ChatGPT
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.model_selection import train_test_split

# Get the app configuration for ml_integration app
ml_integration_app_config = apps.get_app_config('ml_integration')

class_labels_dir = os.path.join(ml_integration_app_config.path, 'Small Set', 'Train Data')

if not os.path.exists(class_labels_dir):
    raise FileNotFoundError(f"Directory '{class_labels_dir}' does not exist.")

class_labels = os.listdir(class_labels_dir)

def preprocess_image(image_path, target_size):
    img = load_img(image_path, target_size=target_size)
    img_array = img_to_array(img)  # Convert PIL image to numpy array
    img_array = img_array / 255.0  # Rescale pixel values to [0, 1]
    return np.expand_dims(img_array, axis=0)  # Add batch dimension

def predict_image(image_path, model):
    target_size = (224, 224)  
    preprocessed_image = preprocess_image(image_path, target_size)
    predictions = model.predict(preprocessed_image)
    predicted_index = np.argmax(predictions)
    predicted_class_label = class_labels[predicted_index]
    probability = predictions[0][predicted_index]
    return predicted_class_label, probability

def predict_user_product(request):
    model_path = os.path.join(ml_integration_app_config.path, 'trained_model_04.h5')
    model = tf.keras.models.load_model(model_path)
    if request.method == 'POST' and request.FILES['image']:
        # Assuming 'image' is the name of the input file field
        image = request.FILES['image']
        # Save the uploaded image to a temporary location
        with open('temp_image.jpg', 'wb+') as destination:
            for chunk in image.chunks():
                destination.write(chunk)
        # Perform prediction
        predicted_class_label, probability = predict_image('temp_image.jpg', model)  # Pass the path to the uploaded image
        corresponding_data = get_corresponding_data(predicted_class_label)
        request.session['corresponding_data'] = corresponding_data
        print(corresponding_data)
        return redirect('addproduct')
        # return HttpResponse(f'Predicted class label: {predicted_class_label}, Probability: {probability}, Corresponding data: {corresponding_data}')
    else:
        return HttpResponse('No image uploaded or invalid request method')

def get_corresponding_data(predicted_label):
    excel_dir = os.path.join(ml_integration_app_config.path, 'test_pro.xlsx')
    df = pd.read_excel(excel_dir)
    corresponding_data = df[df['Name'] == predicted_label]
    return corresponding_data.to_dict('records') if not corresponding_data.empty else None

#####################################
# Now Train the Data
#####################################

def get_training_data_from_db(num_images_per_product=4):
    # Fetch all products that are marked as trained
    trained_products = Product.objects.all()

    # Initialize lists to store features and labels
    images = []
    labels = []

    # Iterate over each trained product
    for product in trained_products:
        # Fetch up to num_images_per_product images associated with the product
        product_images = ProductImages.objects.filter(product=product)[:num_images_per_product]

        # Iterate over each image of the product
        for product_image in product_images:
            # Load image and preprocess it
            image = load_img(product_image.images.path, target_size=(224, 224))
            image = img_to_array(image) / 255.0  # Normalize pixel values
            images.append(image)

            # Add label (example: you can use maincat id as a label)
            labels.append(product.maincat.id)

    return np.array(images), np.array(labels)

# Define your CNN model
def create_model(input_shape, num_classes):
    model = tf.keras.Sequential([
        tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=input_shape),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(128, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Conv2D(128, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D((2, 2)),
        tf.keras.layers.Flatten(),
        tf.keras.layers.Dense(512, activation='relu'),
        tf.keras.layers.Dense(num_classes, activation='softmax')
    ])
    return model

# Train and evaluate the model
def train_model():
    # Get training data from the database
    images, labels = get_training_data_from_db()

    # Split the data into training and validation sets
    X_train, X_val, y_train, y_val = train_test_split(images, labels, test_size=0.2, random_state=42)

    # Create and compile the model
    input_shape = X_train[0].shape
    num_classes = len(np.unique(labels))
    model = create_model(input_shape, num_classes)
    model.compile(optimizer='adam',
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])

    # Train the model
    history = model.fit(X_train, y_train, epochs=10, validation_data=(X_val, y_val))

    # Evaluate the model
    test_loss, test_acc = model.evaluate(X_val, y_val)
    print('Test accuracy:', test_acc)
    print('Test Loss: ', test_loss)

    # Save the trained model
    model.save('trained_model_proj.h5')

    # Save training history for future reference
    np.save('training_history.npy', history.history)

# Call the train_model function to start training
if __name__ == "__main__":
    train_model()
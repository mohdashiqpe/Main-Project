import requests
from bs4 import BeautifulSoup

def get_kerala_districts():
    # URL of the Wikipedia page containing the list of districts in Kerala
    url = 'https://en.wikipedia.org/wiki/List_of_districts_of_Kerala'

    # Send a GET request to the URL
    response = requests.get(url)

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Parse the HTML content of the page using BeautifulSoup
        soup = BeautifulSoup(response.content, 'html.parser')

        # Find the table containing the list of districts
        district_table = soup.find('table', class_='wikitable')

        # Initialize an empty list to store the district names
        district_data = {}

        # Loop through the rows of the table starting from the second row (skipping header row)
        for row in district_table.find_all('tr')[1:]:
            # Find all td elements in the row
            td_elements = row.find_all('td')
            if td_elements:  # Check if td_elements is not empty
                # Get the district name from the first td element
                district_name = td_elements[1].text.strip()
                
                # Find all list items (li) within the row
                list_items = row.find_all('li')
                
                # Extract the text content of each list item and store in a list
                items_list = [item.text.strip() for item in list_items]
                
                # Add the district name and its corresponding items list to the dictionary
                district_data[district_name] = items_list

        return district_data
    else:
        # If the request was not successful, print an error message
        print('Failed to retrieve data from Wikipedia')
        return None

# Call the function to get the list of districts in Kerala
# kerala_districts = get_kerala_districts()
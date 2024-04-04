# Generated by Django 5.0.2 on 2024-04-02 07:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('DeliveryApp', '0004_remove_deliveryunitloca_userauth'),
    ]

    operations = [
        migrations.AddField(
            model_name='unitauthorer',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='unitauthorer',
            name='experience',
            field=models.PositiveIntegerField(default=0),
        ),
    ]

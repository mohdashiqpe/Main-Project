# Generated by Django 4.2.7 on 2023-12-03 19:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('AuthApp', '0003_userloca_street'),
    ]

    operations = [
        migrations.AddField(
            model_name='userloca',
            name='address_mode',
            field=models.IntegerField(null=True),
        ),
    ]

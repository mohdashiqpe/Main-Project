# Generated by Django 4.2.7 on 2023-12-03 21:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Products', '0020_usercart_common_cart'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='usercart',
            name='common_Cart',
        ),
        migrations.RemoveField(
            model_name='usercart',
            name='is_paid',
        ),
    ]

# Generated by Django 4.2.6 on 2023-11-14 16:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('TesterApp', '0003_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='testerdata',
            name='rating',
            field=models.IntegerField(default=0),
        ),
    ]

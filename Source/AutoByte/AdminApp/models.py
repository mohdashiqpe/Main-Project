from django.db import models

class MainCategory(models.Model):
    name = models.CharField(max_length=255, null=True)

class SubCategory(models.Model):
    maincategory = models.ForeignKey(MainCategory, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=255, null=True)

class Brand(models.Model):
    maincategory = models.ForeignKey(MainCategory, on_delete=models.CASCADE, null=True)
    subcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=255, null=True)


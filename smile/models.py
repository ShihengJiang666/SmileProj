from django.db import models

# Create your models here.
class smiles(models.Model):
	space = models.CharField(max_length=128)
	title = models.CharField(max_length=64)
	story = models.CharField(max_length=2048)
	happiness_level = models.IntegerField()
	like_count = models.IntegerField(default=0)
	create_at = models.FloatField()
	updated_at = models.FloatField()

	def __init__(self, *args, **kwargs):
		for elem in args:
			for arg in elem:
				setattr(self,arg,elem[key])
		for arg in kwargs:
			setattr(self,arg,kwargs[arg])

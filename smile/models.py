from django.db import models

# Create your models here.
class smiles(models.Model):
	space = models.CharField(max_length=128)
	title = models.CharField(max_length=64)
	story = models.CharField(max_length=2048)
	happiness_level = models.IntegerField()
	like_count = models.IntegerField(default=0)
	created_at = models.FloatField()
	updated_at = models.FloatField()
	@staticmethod
	def newSmile(*args, **kwargs):
		smile = smiles()
		for elem in args:
			for arg in elem:
				setattr(smile,arg,elem[arg])
		for arg in kwargs:
			setattr(smile,arg,kwargs[arg])
		return smile

# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='smiles',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('space', models.CharField(max_length=128)),
                ('title', models.CharField(max_length=64)),
                ('story', models.CharField(max_length=2048)),
                ('happiness_level', models.IntegerField()),
                ('like_count', models.IntegerField(default=0)),
                ('create_at', models.FloatField()),
                ('updated_at', models.FloatField()),
            ],
        ),
    ]

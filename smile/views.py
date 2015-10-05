from django.shortcuts import render
from django.http import HttpResponse
from django.forms.models import model_to_dict
from time import time
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from models import smiles
import json
# Create your views here.

def getError(request):
	space = request.GET.get('space')
	order = request.GET.get('order_by', 'updated_at')
	count = request.GET.get('count', 20)
	mydict = {}
	if not space:
		mydict['space'] = "space must be non-empty"
	if not order:
		mydict['order'] = "Invalid order_by"
	if not (isNumber(count)) and not (count == 'all'):
		mydict['count'] = "Invalid count"
	return mydict

def postError(request):
	info = json.loads(request.body)
	mydict = {}
	if 'space' in info:
		space = info['space']
	else:
		mydict['space'] = "space must be non-empty"
		if len(space) > 128:
			mydict['spacesize'] = "space must be at most 128 characters" 
	if 'title' in info:
		title = info['title']
		if len(title) > 64:
			mydict['titlelen'] =  "title must be at most 64 characters"
	else:
		mydict['title'] = "title must be non-empty"
	if 'story' in info:
		story = info['story']
		if len(story) > 2048:
			mydict['storylen'] = "story must be at most 2048 characters"
	else:
		mydict['story'] = "story must be non-empty"
	if 'happiness_level' in info:
		happiness_level = info['happiness_level']
		if happiness_level > 3 or happiness_level < 1 or not (type(happiness_level) is int):
			mydict['happiness_level'] = "happiness_level must be an integer from 1 to 3"
	else:
		mydict['happiness_level_missing'] = "happiness_level is missing"
	
	return mydict

def deleteError(request):
	space = request.GET.get('space')
	mydict = {}
	if not space:
		mydict['space'] = "space must be non-empty"
	elif len(space) > 128:
		mydict['spacesize'] = "space must be at most 128 characters" 
	return mydict

def isNumber(s):
	try:
		int(s)
		return True
	except ValueError:
		return False

def doSmile(request):
	if request.method == 'GET':
		response = {}
		error = getError(request)
		if error == {}:
			response['status'] = 1
			count = request.GET.get('count', 20)
			if count == 'all':
				response['smiles'] = map(model_to_dict, smiles.objects.filter(space = request.GET.get('space')).order_by(request.GET.get('-order_by', 'updated_at')))
			else:
				response['smiles'] = map(model_to_dict, smiles.objects.filter(space = request.GET.get('space')).order_by(request.GET.get('-order_by', 'updated_at'))[:int(count)])
		else:
			response['status'] = -1
			response['errors'] = []
			for key in error:
				response['errors'].append(error[key])
		return JsonResponse(response)
	if request.method == 'POST':
		response = {}
		error = postError(request)
		if error == {}:
			newPost = smiles.newSmile(json.loads(request.body),like_count=0,created_at =time(),updated_at=time())
			newPost.save()
			response['status'] = 1
			response['smile'] = model_to_dict(newPost)
		else:
			response['status'] = -1
			response['errors'] = []
			for key in error:
				response['errors'].append(error[key])
		return JsonResponse(response)
	if request.method == 'DELETE':
		response = {}
		error = deleteError(request)
		if error == {}:
			obj = smiles.objects.filter(space = request.GET.get('space'))
			obj.delete()
			response['status'] = 1
		else:
			response['status'] = -1
			response['errors'] = []
			for key in error:
				response['errors'].append(error[key])
		return JsonResponse(response)


def likeSmile(request, id):
	if request.method == 'POST':
		try:
			obj = smiles.objects.get(id=id)
			obj.like_count+=1
			obj.updated_at = time()
			obj.save()
			mydict = {"status":1, "smile":model_to_dict(obj)}
			return JsonResponse(mydict)
		except ObjectDoesNotExist:
			mydict = {'errors': ["Invalid smile id"], "status" : -1}
			return JsonResponse(mydict)
	else:
		return HttpMethodNotAllowed(['POST'])

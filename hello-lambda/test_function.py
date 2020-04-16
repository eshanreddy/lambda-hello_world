import json
def test_function(event, context):
    body={'message':'OK'}
    params = event['eventStringParameters']

    name =str(params['name'])
    helloString = "Hello " + name
    body['helloString'] = helloString

    response={
        'StatusCode':200,
        'body':json.dumps(body),
    }

    return response
    
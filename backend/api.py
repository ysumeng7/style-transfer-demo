from base64 import b64decode, b64encode
from flask import Flask, jsonify
from flask_cors import CORS
from flask_restful import Api, Resource, reqparse
from io import BytesIO
from PIL import Image
from requests import post
import json
import numpy as np
import os


app = Flask(__name__)
CORS(app)

api = Api(app)

parser = reqparse.RequestParser()

parser.add_argument('image', type=str, help='image in base64 encoded string')
parser.add_argument('style', type=int, help='style index to apply on image')

url = 'http://model:8501/v1/models/style-transfer:predict'

# simple DB to store data
DB = {
    'data': None,
    'header': None
}

class StyleTransfer(Resource):
    
    def put(self):
        try:
            args  = parser.parse_args(strict=True)
            header, image = args.image.split(',')
            # preprocessing
            image = np.array(Image.open(BytesIO(b64decode(image))).convert('RGB')).tolist()
            
            data = {'inputs': {'image': image, 'style': None}}
            DB['data'] = data
            DB['header'] = header

            return {'status': 'ok'}, 200
        except Exception as e:
            return {'message': str(e)}, 200

    def post(self):
        try:
            args  = parser.parse_args(strict=True)
            if not args.style in range(10):
                return {'message': f'unknonw style ID {args.style}'}, 404

            data = DB['data']
            data['inputs']['style'] = args.style

            resp = post(url, json.dumps(data))
            assert resp.status_code // 100 == 2, f'bad status code: {resp.status_code}'

            style_image = Image.fromarray(np.array(resp.json()['outputs']).astype(np.uint8))
            with BytesIO() as byte_image:
                style_image.save(byte_image, format='PNG')
                style_image = b64encode(byte_image.getvalue()).decode('utf-8')
            # add header to simulate js img URI format
            return {'style-image': DB['header'] + ',' + style_image}, 200
        except Exception as e:
            return {'message': str(e)}, 200


api.add_resource(StyleTransfer, '/style-transfer')

if __name__ == '__main__':
    app.run(host='0.0.0.0')

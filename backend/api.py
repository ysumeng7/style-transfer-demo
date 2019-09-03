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


class StyleTransfer(Resource):
    def get(self):
        return {'test': 'ok'}, 200

    def post(self):
        try:
            args  = parser.parse_args(strict=True)
            # decode arguments
            header, image = args.image.split(',')
            # preprocessing
            image = np.array(Image.open(BytesIO(b64decode(image))).convert('RGB')).tolist()
            style = args.style - 1
            # check conditions
            assert style in range(10), f'style: {style} is out of range, range: 0-9'
            # post to tensorflow serve
            data = json.dumps({
                'inputs': {
                    'image': image,
                    'style': style
                }
            })
            resp = post(url, data)
            # check result
            assert resp.status_code // 100 == 2, f'bad status code: {resp.status_code}'
            # postprocessing
            style_image = Image.fromarray(np.array(resp.json()['outputs']).astype(np.uint8))
            with BytesIO() as byte_image:
                style_image.save(byte_image, format='PNG')
                style_image = b64encode(byte_image.getvalue()).decode('utf-8')
            # add header to simulate js img URI format
            return {'style-image': header + ',' + style_image}, 200
        except Exception as e:
            return {'message': str(e)}, 200


api.add_resource(StyleTransfer, '/style-transfer')

if __name__ == '__main__':
    app.run(host='0.0.0.0')

FROM tensorflow/serving:latest
COPY . /models
EXPOSE 8501
CMD ["tensorflow_model_server", "--port=8500", "--rest_api_port=8501", "--model_name=style-transfer", "--model_base_path=/models/style-transfer"]
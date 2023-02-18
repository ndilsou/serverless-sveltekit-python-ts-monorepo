# Define function directory
ARG WHEEL=apigw-0.0.1-py3-none-any.whl 
ARG LAMBDA_TASK_ROOT="/var/task"

FROM python:3.11.2-slim-bullseye as lambda-rie-image
RUN apt-get update && \
    apt-get install -y curl

ENV AWS_LAMBDA_RIE_URL=https://github.com/aws/aws-lambda-runtime-interface-emulator/releases/latest/download/aws-lambda-rie
RUN curl -Lo /usr/local/bin/aws-lambda-rie $AWS_LAMBDA_RIE_URL
RUN chmod +x /usr/local/bin/aws-lambda-rie

FROM python:3.11.2-slim-bullseye as build-image

# Install aws-lambda-cpp build dependencies
RUN apt-get update && \
    apt-get install -y \
    g++ \
    make \
    cmake \
    unzip \
    libcurl4-openssl-dev


# Include global arg in this stage of the build
ARG LAMBDA_TASK_ROOT


# Create function directory
RUN mkdir -p ${LAMBDA_TASK_ROOT}

# Install the runtime interface client
RUN pip install \
    --target ${LAMBDA_TASK_ROOT} \
    awslambdaric

ARG WHEEL
COPY ./dist/$WHEEL ${LAMBDA_TASK_ROOT} 
RUN pip install --no-cache-dir --upgrade ${LAMBDA_TASK_ROOT}/$WHEEL --target ${LAMBDA_TASK_ROOT} \
    && rm -rf ${LAMBDA_TASK_ROOT}/$WHEEL

# Multi-stage build: grab a fresh copy of the base image
FROM python:3.11.2-slim-bullseye

COPY ./lambda-entrypoint.sh /lambda-entrypoint.sh
RUN chmod +x /lambda-entrypoint.sh

# Include global arg in this stage of the build
ARG LAMBDA_TASK_ROOT

# Set working directory to function root directory
WORKDIR ${LAMBDA_TASK_ROOT}

# Copy in the build image dependencies
COPY --from=lambda-rie-image /usr/local/bin/aws-lambda-rie /usr/local/bin/aws-lambda-rie
COPY --from=build-image ${LAMBDA_TASK_ROOT} ${LAMBDA_TASK_ROOT}

ENTRYPOINT [ "/lambda-entrypoint.sh" ]

CMD [ "mono.apigw.lambda_handler" ]

import uuid
from typing import Callable

import requests
from aws_lambda_powertools import Logger, Tracer
from aws_lambda_powertools.event_handler import APIGatewayHttpResolver
from aws_lambda_powertools.logging import correlation_paths
from aws_lambda_powertools.utilities.data_classes import (
    APIGatewayProxyEventV2)
from aws_lambda_powertools.utilities.typing import LambdaContext
from humps import camelize
from pydantic import BaseModel
from requests import Response

tracer = Tracer()
logger = Logger()
app = APIGatewayHttpResolver(debug=True)

class APIModel(BaseModel):
    class Config:
        alias_generator: Callable[[str], str] = camelize
        allow_population_by_field_name = True


class NewTask(APIModel):
    user_id: int
    title: str
    completed: bool

class Task(APIModel):
    user_id: int
    id: str
    title: str
    completed: bool


# class NewTaskModel(APIGatewayProxyEventV2Model):
#     body: Json[NewTask]  # type: ignore[assignment]


@app.get("/tasks")
@tracer.capture_method
def get_task():
    tasks: Response = requests.get("https://jsonplaceholder.typicode.com/todos")
    tasks.raise_for_status()

    # for brevity, we'll limit to the first 10 only
    return {"tasks": tasks.json()[:10]}


@app.post("/tasks")
@tracer.capture_method
def create_task():
    new_task = NewTask.parse_obj(app.current_event.json_body)  # deserialize json str to dict

    task = Task(
        user_id=new_task.user_id,
        id=uuid.uuid4().hex,
        title=new_task.title,
        completed=new_task.completed,
    )

    return task.dict()


# You can continue to use other utilities just as before
@logger.inject_lambda_context(correlation_id_path=correlation_paths.API_GATEWAY_HTTP)
@tracer.capture_lambda_handler
def lambda_handler(event: APIGatewayProxyEventV2, context: LambdaContext) -> dict:
    return app.resolve(event, context)

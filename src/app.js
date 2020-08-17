const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request,response,next){
  const {id} = request.params;

  if(!isUuid(id)){
      return response.status(400).json({
          error: 'Invalid Repository Id'
      });
  };

  return next();
}



app.get("/repositories", (request, response) => {


  return response.json(repositories);

});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;


  const repository = { id: uuid(), title, url, techs, likes: 0 }

  repositories.push(repository)

  return response.json(repository);
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoriesIndex = repositories.findIndex(repository => repository.id === id);
  const { likes } = repositories.find(repository => repository.id === id);

  if (repositoriesIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }
  const { title, url, techs } = request.body;

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoriesIndex] = repository

  return response.json(repository)
});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params

  const repositoriesIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoriesIndex < 0) {
    return response.status(400).json({ error: 'Repository not found' })
  }

  repositories.splice(repositoriesIndex, 1)


  return response.status(204).send()
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const initialRepository = repositories.find(repository => repository.id === id);
  const repositoriesIndex = repositories.findIndex(repository => repository.id === id);

  if(!initialRepository){
    return response.status(400).json({ error: 'Repository not found' });
  }
  

  const finalRepository = {
    ...initialRepository,
    likes: Number(initialRepository.likes + 1)
  }

  repositories[repositoriesIndex] = finalRepository

  return response.json(finalRepository);
});

module.exports = app;

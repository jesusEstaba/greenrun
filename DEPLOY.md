# Deploy

## Required
- docker
- heroku cli

### Heroku login
```bash
heroku login
heroku container:login
```

## Deployment
### Register image

```bash
heroku container:push web --app greenrun
```

### Push image

```bash
heroku container:release web --app greenrun
```

> note:
> You can watch the logs with: 
> `heroku logs --tail --app greenrun`
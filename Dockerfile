FROM node:22-alpine AS base

FROM base AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN npm install

FROM base AS production-dependencies-env
COPY ./package.json /app/
WORKDIR /app
RUN npm install --omit=dev

FROM base AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

FROM base
COPY ./package.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]
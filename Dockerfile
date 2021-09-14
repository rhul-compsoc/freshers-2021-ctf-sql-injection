FROM node

WORKDIR /code

# Copy package information, then download them
COPY package.json /code/package.json
COPY yarn.lock /code/yarn.lock
RUN yarn

# Copy over source material
COPY tsconfig.json /code/tsconfig.json
COPY src /code/src
RUN yarn build

CMD yarn start

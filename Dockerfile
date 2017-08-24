From node:8.4.0
ENV APP_HOME /usr/app
RUN mkdir $APP_HOME
WORKDIR $APP_HOME
COPY package.json $APP_HOME
COPY . $APP_HOME
RUN npm install
CMD $APP_HOME/bin/frunt-api-mock.js -p 8070


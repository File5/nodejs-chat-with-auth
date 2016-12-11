# NodeJS chat with registration and authorization
### Requirements
- NodeJS & npm
- MySQL

### Setup
1.  Create MySQL user for chat, create database.

    You can use the following commands:
    ```
    mysql -u root -p <your_root_password>
    ```
    
    In MySQL shell:
    ```
    CREATE USER 'chatwithauth'@'localhost' IDENTIFIED BY 'secretpassword';
    CREATE DATABASE `chat-with-auth`;
    GRANT ALL PRIVILEGES ON `chat-with-auth`.* TO 'chatwithauth'@'localhost' WITH GRANT OPTION;
    ```
2.  Clone repository.

    In shell: `git clone https://github.com/File5/nodejs-chat-with-auth.git`
3.  Initialize database.

    ```
    cd nodejs-chat-with-auth/chat-with-auth
    npm install
    npm run syncdb
    mysql -u chatwithauth -p secretpassword
    ```
    In MySQL shell:
    ```
    USE `chat-with-auth`;
    ALTER TABLE Users MODIFY hash VARCHAR(1024);
    ```
4.  Edit config file.

    ```
    nano nodejs-chat-with-auth/chat-with-auth/config.js
    ```
    In editor:
    ```
    var config = {
      protocol: 'mysql',
      host: 'localhost',
      port: 3306,
      user: 'chatwithauth',
      password: 'kursk156chat',
      database: 'chat-with-auth'
    };
    ```
5.  Run project.

    ```
    npm start
    ```
6.  Test it.

    Go to http://127.0.0.1:3000

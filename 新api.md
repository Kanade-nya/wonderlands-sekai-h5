## 合集功能

### 数据库表结构

|     名字      | 类型     |     备注      |   
|:-----------:|:-------|:-----------:|
|     id      | Number |    自增id     |
|    Name     | String |    合集名称     |  
| description | Text   |    合集介绍     |
|    list     | Text   | 包含的图像的id的数组 |
| create_date | Date   |    创建时间     |

### api1: 新建合集

- Method: post
- params:
    - name（String）: 合集名称
    - description（String）: 合集介绍
    - list（String）: 包含id的数组
    - page_size: 返回的数据数量

### api2: 返回合集
后台根据list的id直接查数据，然后返回带有数据的collection_list
- Method: get
    - response:
      ```json
        "total": "12",
        "list": [
          {
            "id": 1,
            "name": "合集1",
            "description": "合集1的描述",
            "create_date": "2019-01-01 00:00:00",
            "collection_list": [
              {
                // 合集中的所有数据
              },
              {
                // 合集中的所有数据
              }
            ]
          },
          {
            ///......
          }
        ]
      }
      ```

## 注册/登录模块


### 注册
#### api1: 注册
- Method: post
- params:
  - name（String）: nickname
  - email（String）: email
  - password（String）: 密码
  - code: 验证码

- response
  - code : 200 成功
    - token: 用户token
    - user: 用户信息（对象）
      - id: 用户id
      - username: 用户名
      - avatar: 头像地址（可为空）
  - code : 400 失败（验证码错误）
  - code : 500 失败 (服务器错误)

#### api2: 邮箱验证码
- Method: post
- params: 
  - email:邮箱 (生成一段验证码并发送给对应邮箱，验证码有效时间5分钟)

### 登录

#### api1: 登录
- Method: post
- params:
  - email（String）: email
  - password（String）: 密码

- response:
  - code: 200 成功
  - token: 用户token
    - user: 用户信息（对象）
      - id: 用户id
      - username: 用户名
      - avatar: 头像地址（可为空）

#### api2: 保持登录状态
- Method: get
- params: 
  - token: 用户token

- response:
  - code: 200 成功
    - user: 用户信息（对象）
      - id: 用户id
      - username: 用户名
      - avatar: 头像地址（可为空）
  - code: 400 失败（token错误）

### Comments


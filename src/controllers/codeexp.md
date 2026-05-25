# Register Controller Types

Main line:

```ts
req: Request<{}, {}, RegisterBody>,
res: Response<ResponseBody>
): Promise<void>
```

## `req: Request<{}, {}, RegisterBody>`

`req` ka matlab request.

Frontend/client jo data backend ko bhejta hai, woh `req` me milta hai.

Express `Request` ka generic structure roughly aisa hota hai:

```ts
Request<Params, ResBody, ReqBody, ReqQuery>
```

Tumne likha:

```ts
Request<{}, {}, RegisterBody>
```

Iska meaning:

```txt
first  {}           = req.params ka type
second {}           = response body type, yahan important nahi
third  RegisterBody = req.body ka type
```

Register route usually aisa hota hai:

```txt
POST /register
```

Is route me URL params nahi hain, isliye first `{}`.

Request body me user data aayega, isliye third place par `RegisterBody` diya:

```ts
req.body.firstName
req.body.emailId
req.body.password
```

TypeScript ko ab pata hoga ki `req.body` ka structure `RegisterBody` jaisa hai.

## `res: Response<ResponseBody>`

`res` ka matlab response.

Backend client/frontend ko jo reply bhejta hai, woh `res` se bhejta hai.

```ts
Response<ResponseBody>
```

Iska matlab response body ka shape `ResponseBody` jaisa hoga.

Example:

```ts
interface ResponseBody {
  message: string;
}
```

Toh ye valid hoga:

```ts
res.status(201).json({
  message: "Registered successfully",
});
```

Yani response me `message` string bhejni hai.

## `): Promise<void>`

Function `async` hai, isliye return type `Promise` hoga.

`void` ka matlab:

```txt
function koi useful value return nahi kar raha
```

Express controller me client ko data `return` se nahi bhejte.

Client ko data yahan se jaata hai:

```ts
res.status(201).json(...)
```

Isliye controller ka return type:

```ts
Promise<void>
```

Simple meaning:

```txt
async controller hai,
response res.json() se bhejega,
return value ka use nahi hai.
```


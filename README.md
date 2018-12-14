# Boardroom

- Join a meeting room contains 7 people at most (audiences will not be counted) with custom configuration

Created for the Agora Video RTC Web Challenge:
https://agora.devpost.com/

Going after the following featueres:
1. Quality Transparency
2. Device Management
3. Volume Indicator


## Dev Notes
First, create a developer account at [Agora.io](https://dashboard.agora.io/signin/), and obtain an App ID.

Update "agora.config.js" in "/src" with your App ID.

``` javascript
export const AGORA_APP_ID = 'abcdefg'
```

<del>Then download our SDK 'AgoraRTC-*.js', rename it to 'AgoraRTC.js' and put it under the path '/src/library/'.</del>
Now we use cdn to get sdk. You do not have to download it by yourself any more. 

Run yarn to install dependencies and start the sever
<pre>
    yarn && yarn start
</pre>

## License
The MIT License (MIT).

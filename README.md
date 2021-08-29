# Formidable
> A Node.JS server side Azur Lane Data API that automatically manages and updates your data as needed!
<p align="center">
  <img src="https://azurlane.netojuu.com/w/images/3/3a/FormidableSummerWithoutBG.png">
</p>

## Features
* Speedy
* Reliable
* Simple
* Built-in Ratelimits
* Automated Data Maintenance
* Supported Data: `Ship`, `Equipments`, `Barrages`, `Chapters` and `VoiceLines`

## TODO's
* Config File
* Authentication (Probably token & authentication support(?))
* More endpoints for the supported datas

## Support

🔗 https://discord.com/invite/FVqbtGu (#development)

🔗 https://discord.com/invite/aAEdys8 (#support)

## API Ratelimits
| Global        | Default      | 404 requests  |
| :-----------: | :----------: | :-----------: |
| 150req / 5s | 100req / 5s | 5req / 5s |
> The Default ratelimit is based on per endpoint, the endpoint can have it's own ratelimit, or use the default one. Refer to the endpoints documentation below

## Endpoints
### Ships 
| Enpoint         | Ratelimit      | Return Data     | Description     |
| :-------------: | :-------------: | :-------------: | :-------------: |
| GET /ships/search?name='Formidable' | 75req / 5s | Object[] | Searches for the ship of your choice |
### Equipments
| Enpoint         | Ratelimit      | Return Data     | Description     |
| :-------------: | :-------------: | :-------------: | :-------------: |
| GET /equipments/search?name='Twin 410mm' | 75req / 5s | Object[] | Searches for the equip of your choice |
### Chapters
| Enpoint         | Ratelimit      | Return Data     | Description     |
| :-------------: | :-------------: | :-------------: | :-------------: |
| GET /chapters/search?code='6-4' | 75req / 5s | Object[] | Searches for the chapter via it's code |
### Voice Lines
| Enpoint         | Ratelimit      | Return Data     | Description     |
| :-------------: | :-------------: | :-------------: | :-------------: |
| GET /voicelines/ship?id='147' | 100req / 5s | Object | Gets the voice lines on a ship via it's ID |
### Barrages
| Enpoint         | Ratelimit      | Return Data     | Description     |
| :-------------: | :-------------: | :-------------: | :-------------: |
| GET /barrages/ship?name='147' | 100req / 5s | Object | Gets a ship barrage via it's name |
### Update Data
| Enpoint         | Ratelimit      | Return Data     | Description     |
| :-------------: | :-------------: | :-------------: | :-------------: |
| POST /update | 1req / 120s | String | Force updates the local data and updates the cache |

> Made with ❤ by @Sāya#0113

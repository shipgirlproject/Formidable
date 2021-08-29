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
| Endpoint         | Ratelimit      | Return Data     | Description     |
| :-------------: | :------------: | :-------------: | :-------------: |
| GET /ships/class?name=Iowa | 100req / 5s | Object[] | List all the ships that has this class |
| GET /ships/hull?name=Battleship | 100req / 5s | Object[] | List all the ships that has this hull type |
| GET /ships/id?code=147 | 100req / 5s | Object | Gets the ship with this ID |
| GET /ships/nationality?name=Sakura%20Empire | 100req / 5s | Object[] | List all the ships that has this nationality |
| GET /ships/rarity?name=Super%20Rare | 100req / 5s | Object[] | List all the ships that has this rarity |
| GET /ships/search?name=Formidable | 75req / 5s | Object[] | Searches for the ship of your choice |
### Equipments
| Endpoint         | Ratelimit      | Return Data     | Description     |
| :-------------: | :------------: | :-------------: | :-------------: |
| GET /equipments/category?name=Destroyer%20Guns | 100req / 5s | Object[] | List all the equipments that is in this category |
| GET /equipments/nationality?name=Sakura%20Empire | 100req / 5s | Object[] | List all the equipments that has this nationality |
| GET /equipments/search?name=Twin%20410mm | 75req / 5s | Object[] | Searches for the equip of your choice |
### Chapters
| Endpoint         | Ratelimit      | Return Data     | Description     |
| :-------------: | :-------------: | :-------------: | :-------------: |
| GET /chapters/search?code=6-4 | 75req / 5s | Object[] | Searches for the chapter via it's code |
### Barrages
| Endpoint         | Ratelimit      | Return Data     | Description     |
| :-------------: | :------------: | :-------------: | :-------------: |
| GET /barrages/search?name=Ayanami | 75req / 5s | Object | Searches a ship barrage via it's name |
### Voice Lines
| Endpoint         | Ratelimit      | Return Data     | Description     |
| :-------------: | :------------: | :-------------: | :-------------: |
| GET /voicelines/ship?id=147 | 100req / 5s | Object | Gets the voice lines on a ship via it's ID |
### Data Version
| Endpoint         | Ratelimit      | Return Data     | Description     |
| :-------------: | :------------: | :-------------: | :-------------: |
| GET /version | 100req / 5s | Object | Gets the current data version of Formidable |
### Data Update
| Endpoint         | Ratelimit      | Headers        | Return Data     | Description     |
| :-------------: | :------------: | :------------: | :-------------: | :-------------: |
| POST /update | 1req / 120s | {"authorization": "your config auth"} | String | Force updates the local data and updates the cache |

> Made with ❤ by @Sāya#0113

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
* Global: `150 req / 5s`
* Default: `100 req / 5s` 
* Per Route: `Can be default or customized, refer to Data Endpoints and Other Endpoints`

## Data Endpoints 
> Documentation Format => `Endpoint` | Description | **Ratelimit** | Return Data
### Ships
* `/ships/search?name='Formidable'` | Searches for the ship of your choice | **75req / 5s** | Object[]
### Equipments
* `/equipments/search?name='Twin 410mm'` | Searches for the equip of your choice | **75req / 5s** | Object[]
### Chapters
* `/chapters/search?code='6-4'` | Searches for the chapter via it's code | **75req / 5s** | Object[]
### Voice Lines
* `/voicelines/ship?id='147'` | Gets the voice lines on a ship via it's ID | **100req / 5s** | Object
### Barrages
* `/barrages/ship?name='147'` | Gets a ship barrage via it's name | **100req / 5s** | Object[]

## Other Endpoints
> Documentation Format => `Endpoint` | Description | **Ratelimit** | Return Data
### Update Data
* `/update | Force updates the local data and updates the cache` | **1req / 120s** | String

> Made with ❤ by @Sāya#0113

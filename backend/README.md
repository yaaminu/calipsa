#Backend implementation 

## Running The Server
```bash 
  npm install && npm start
```
The server will start on port 3000, ready to accept new requests. 

## NB: All requests require basic authentication. When prompted, supply the following 
username: admin
password: s3cr3te 

## Listing alarms 

### listing all alarms withn a given timestamp range inclusive
GET `/alarms/?timestamp_range=timesamp_from,timestamp_to`.     

### listing all alarms that have been processed 
GET `/alarms/?outcome=1`.     

### listing all alarms that have not been processed 
GET `/alarms/?outcome=0`.     

### selecting custom page_size 
GET `/alarms/?outcome=0&page_size=25`.     



## Testing 
```bash
  npm test
```



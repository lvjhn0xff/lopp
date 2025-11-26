# Polymorphic Entities (Schema)

The schema below will be implemented using STI.


```sql
model User 
    id - big-integer 
    username - string 
    password - string
    email - string
    createdAt - string 
    updatedAt - string 

model MediaContent  
    id - big-integer 
    title - string 
    description - string 
    license - string
    uploaderId - User.id    
    fileSizeBytes - integer
    fileType - string
    createdAt - string 
    updatedAt - string 


    model Photo 
        widthPX - integer 
        heightPX - integer
        DPI - integer 

        model GIF   
            noOfFrames - integer

    model Audio 
        length - integer 
        quality - integer 

        model Music
            artist - string

            model Instrumental 

            model Song     
                hasExplicitContent - string
                lyrics - string  

        model SoundEffect

    model Video 
        isAnimated - boolean 
        length - string 
        widthPX - integer 
        heightPX - integer  
        resolution - integer 

        model Film
            ageRating - string 

            model Series 
                noOfEpisodes - integer

            model Movie
                isPartOfMovieSeries - boolean

        model MusicVideo 
            songId - Song.id 
            model LyricVideo
            model MusicVideo

        model Documentary
            model MiniDocumentary  
            model FullLengthDocumentary
```
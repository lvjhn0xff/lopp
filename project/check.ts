import { bootSchema, extend, PolymorphicSchema, resolveType } from "#lopp/core/polymorphic_schema"

export async function check() {

    class MediaContent extends PolymorphicSchema 
    {
        static fields = [
            "id",
            "title",
            "description"
        ]

        static Photo = 
            extend(MediaContent, [  
                "widthPX",
                "heightPX"
            ])

            static GIF = 
                extend(MediaContent.Photo, [
                    "noOfFrames"
                ])

        static Audio = 
            extend(MediaContent, [
                "lengthSeconds"
            ])
        
        static Video = 
            extend(MediaContent, [
                "lengthSeconds", 
                "widthPX",
                "heightPX",
                "resolution"
            ])
    }

    bootSchema(MediaContent)
    console.log(MediaContent.children)
    const type = resolveType(MediaContent, "Photo")
    console.log(type)
}
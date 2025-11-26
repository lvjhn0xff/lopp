# Polymorphic Entities (Schema)

Lopp follows the common schema for defining EAV models.

```sql
table _EAV_Attributes_
    attribute_id - big-integer 
    name - varchar 

table _EAV_Entities_ 
    entity_id - big-integer 
    name - varchar 

table _EAV_Values_STRING_
    value_id - big-integer 
    value  - string  
    attribute_id - Attribute.id
    entity_id - Entity.id

table _EAV_Values_TEXT_
    value_id - big-integer 
    entity_id - Entity.id
    attribute_id - Attribute.id
    value  - text 

table _EAV_Values_VARCHAR_
    value_id - big-integer 
    entity_id - Entity.id
    attribute_id - Attribute.id
    value - varchar

table _EAV_Values_INT_
    value_id - big-integer 
    entity_id - Entity.id
    attribute_id - Attribute.id
    value - integer

table _EAV_Values_BIGINT_
    value_id - big-integer 
    entity_id - Entity.id
    attribute_id - Attribute.id
    value - bigint    

table _EAV_Values_STRING_ARRAY_
    value_id - big-integer 
    entity_id - Entity.id
    attribute_id - Attribute.id
    value  - string  
    position - integer

table _EAV_Values_TEXT_ARRAY_
    value_id - big-integer 
    entity_id - Entity.id
    attribute_id - Attribute.id
    value  - text 
    position - integer

table _EAV_Values_VARCHAR_ARRAY_
    value_id - big-integer 
    entity_id - Entity.id
    attribute_id - Attribute.id
    value - varchar
    position - integer

table _EAV_Values_INT_ARRAY_
    value_id - big-integer 
    entity_id - Entity.id
    attribute_id - Attribute.id
    value - integer
    position - integer

table _EAV_Values_BIGINT_ARRAY_
    value_id - big-integer 
    entity_id - Entity.id
    attribute_id - Attribute.id
    value - bigint  
    position - integer

SELECT * FROM Post WHERE id = 1 
    INNER JOIN _EAV_Values_INT_ as EAV
        ON EAV.entity_id = @entity(Post)
           EAV.attribute_id = @attribute("color")
           EAV.value = "red"

SELECT * FROM Post WHERE id = 1 
    INNER JOIN _EAV_Values_INT_ARR_ as EAV
        ON EAV.entity_id = @entity(Post)
           EAV.attribute_id = @attribute("features")
           EAV.position = 5 

SELECT string_agg(e.value, ',') FROM Post WHERE id = 1 
    INNER JOIN _EAV_Values_INT_ARR_ as EAV
        ON EAV.entity_id = @entity(Post)
           EAV.attribute_id = @attribute("features")
           EAV.value IN ("featureA", "featureB", "featureC")
GROUP BY p.id 

SELECT 
    p.id,
    string_agg(e.value, ',') AS features
FROM Post 
INNER JOIN _EAV_Values_INT_ARR_ as EAV
    ON EAV.entity_id = p.id
    AND EAV.attribute_id = 'features'
WHERE EAV.value IN ('featureA', 'featureB', 'featureC')
  AND p.id = 1
GROUP BY p.id;

```

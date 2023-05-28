//import * as React from 'react';
import React, { useState } from 'react';
import { Button, View , Image, Text } from 'react-native';
import 'react-native-gesture-handler';


const BookInfoScreen = ({navigation}) => {
    const [form, setForm] = useState({
        title : '',
        author : '',
        page_number : '',
        isbn : '',
        image : {
          uri: require("./img/harrypotter_1.jpg"), /* change to default */
          type: 'image/jpeg',
          name: 'default_cover.jpg',
        },
        status: 0,
    });

    const onChangeText = (item: string) => (value: string) => {
        setForm({
            ...form,
            [item]: value
        });
    };

    const uploadImage = () => {
        ImagePicker.launchImageLibrary({}, response => {
          if (response.didCancel) {
            return;
          }

          const inputImage = {
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].name,
          };

          setForm({
            ...form,
            image : inputImage
          });
        });
    };

    const onSubmit = (form) => {
      console.log(form);
    };

    /* notes:
     * check if page_number needs to be numeric
     */

    return(
        <View style = {styles.container}>
            <Text style = {styles.title}>
                Add book directly: 
            </Text>
            <View style = {styles.bookCover}>
                <Image source = {form.image.uri} style={styles.bookCoverImage}/>
            </View>
            <Button
                title = "Change Cover"
                onPress = {uploadImage}
            />

            <View style = {{alignItems: "center", gap: 5, padding: 5}}>
                <TextInput placeholder = "title" style = {styles.input} onChangeText={onChangeText("title")} value = {form.title}/>
                <TextInput placeholder = "author" style = {styles.input} onChangeText={onChangeText("author")} value = {form.author}/>
                <TextInput placeholder = "page" style = {styles.input} onChangeText={onChangeText("page_number")} value = {form.page_number}/>
                <TextInput placeholder = "isbn" style = {styles.input} onChangeText={onChangeText("isbn")} value = {form.isbn}/>
            </View>
            
            <Button
                title = "Save Book"
                onPress = {() => onSubmit(form)}
            />
            
            <Button
                title="go back home"
                onPress={() => navigation.navigate("HomeScreen")}
            />
        </View>
    );

}
export {BookInfoScreen};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    title: {
        fontSize: 30,
        color: "black",
        alignItems: "center",
    },
    bookCover: { //!!from OdokTimerScreen
        height: 250,
        width: 200,
//        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 30,
    },
    bookCoverImage: {
        width: '100%',
        height: 250,
        resizeMode: 'contain',
    },
    input: {
        height: 40, //!!change values
        width: 100, //!!change values
        borderWidth: 2,
        padding: 10,
    },

})

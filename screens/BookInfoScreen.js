//import * as React from 'react';
import React, { useState } from 'react';
import { Button, View , Image, Text } from 'react-native';
import 'react-native-gesture-handler';


const BookInfoScreen = ({navigation}) => {
    return (
        <View>
            <Text style={{ fontSize: 10, color: "black" }}> //!!what text??
                Add book directly:
            </Text>
        </View>
    )

    const [form, setForm] = useState({
        title = '',
        author = '',
        page = '',
        isbn = '',
        image = '',
    });

    const onChangeText = (item: string) => (value: string) {
        setForm({
            ..form,
            [item]: string
        })
    }

    return(
        <View style={styles.container}}>
//            <Text style = styles.title>
//                ODOK
//            </Text> //!!maybe not needed
            <Text style={{ fontSize: 10, color: "black" }}>
                Add book directly: //!!what text??
            </Text>
            <View style={{ styles.bookCover }}>
                <Image source={{uri: image.uri}} style={styles.bookCoverImage}>
            </View>
            <Button
                title = "Change Cover"
                onPress = {() => onSubmit(form)}
            />

            <View>
                <TextInput placeholder = "title" style = {styles.input} onChangeText={onChangeText("title")} value = {form.title}/>
                <TextInput placeholder = "author" style = {styles.input} onChangeText={onChangeText("author")} value = {form.author}/>
                <TextInput placeholder = "page" style = {styles.input} onChangeText={onChangeText("page")} value = {form.page}/> //!!check if numeric
                <TextInput placeholder = "isbn" style = {styles.input} onChangeText={onChangeText("isbn")} value = {form.isbn}/>
            </View>
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
        width: 10, //!!change values
        borderWidth: 2,
        padding: 10,
    },

})
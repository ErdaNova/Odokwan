//import * as React from 'react';
import React, { useState } from 'react';
import { Button, View , Image, Text, KeyboardAvoidingView } from 'react-native';
import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useRealm } from '../App';
import {colors, regWidth, regHeight} from '../config/globalStyles';



const BookInfoScreen = ({navigation, route}) => {
    // return (
    //     <View>
    //         <Text style={{ fontSize: 10, color: "black" }}>
    //             Add book directly:
    //         </Text>
    //     </View>
    // )
    
    const addImage = () => {
        launchImageLibrary({allowEditing:true ,maxHeight:10}, response =>{
            if(response.didCancel != true){setImage(response.assets[0].uri);}
            
        })
    }

    const realm = useRealm();



    const [title, setTitle] = useState(route.params.title)
    const [author, setAuthor] = useState(route.params.author)
    const [page, setPage] = useState(route.params.page)
    const [image, setImage] = useState(route.params.image)

    const currentId = () =>{
        if(realm.objects("Book").max("_id")){
            return(Number(realm.objects("Book").max("_id")+1))
        }else{
            return(1)
        }
    }


    const createBook = () => {
        realm.write(() => {
            realm.create("Book", {
                _id : currentId(),
                title: title,
                author: author,
                image: image,
                page: Number(page),
                readPage: 0,
                status : 0
            })
        }
        
        )
        // navigation.navigate("BooklistScreen")
        navigation.popToTop();
    }




    return(
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {image 
                ? 
                <View style={ styles.bookCover }>
                    <Image source={{uri: image}} style={styles.bookCoverImage}/>
                </View>
                :
                <></>

            }
            
            <Button
                title = "Change Cover"
                onPress={()=>addImage()}
            />

            <View>
                <TextInput placeholder = "title" style = {styles.input} onChangeText={ (text) => setTitle(text) } value = {title}/>
                <TextInput placeholder = "author" style = {styles.input} onChangeText={(text) => setAuthor(text)} value = {author}/>
                <TextInput placeholder = "total page" style = {styles.input} onChangeText={(text) => setPage(text)} value = {page} keyboardType='numeric' numeric/>
            </View>
            <Button
                title="save"
                onPress={createBook}
            />
        </KeyboardAvoidingView>
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
        width: regWidth * 240,
        height: regWidth * 240,
        resizeMode: 'contain',
    },
    input: {
        height: regHeight * 40, //!!change values
        width: regWidth * 200, //!!change values
        borderWidth: regWidth * 2,
        padding: regWidth * 10,
    },

})
//import * as React from 'react';
import React, { useState } from 'react';
import { Button, View , Image, Text, KeyboardAvoidingView } from 'react-native';
import 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { TextInput } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useRealm } from '../App';
import {colors, regWidth, regHeight} from '../config/globalStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';


const BookInfoScreen = ({navigation, route}) => {
    
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
         <Text style={styles.maintitle}>
            Add a book
        </Text> 
            {/* {image 
                ? 
                <View style={styles.bookCover }>
                    <Image source={{uri: image}} style={styles.bookCoverImage}/>
                </View>
                :
                <></>

            } */}
            <TouchableOpacity onPress={addImage}>  
            <View style={styles.imageContainer}>
                {image ? (
                    <Image source={{uri: image}} style={styles.bookCoverImage} />
                ) : null}
            </View>
            </TouchableOpacity>
            {/* <View style={{marginTop: -30, marginBottom: 10}}>
            <Button
                title = "Change Cover"
                onPress={()=>addImage()}
            />
            </View> */}
            <View>
                <Text>Title</Text>
                <TextInput style = {styles.input} onChangeText={ (text) => setTitle(text) } value = {title}/>
                
                <Text>Author</Text>
                <TextInput style = {styles.input} onChangeText={(text) => setAuthor(text)} value = {author}/>

                <Text>Total page</Text>
                <TextInput style = {styles.input} onChangeText={(text) => setPage(text)} value = {page} keyboardType='numeric' numeric/>
            </View>
            <View style={{marginTop: 15}}>
            <Button
                title="Save"
                onPress={createBook}
            />
            </View>
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
        borderColor: "black",
        borderWidth: 2,
    },
    input: {
        height: regHeight * 40, //!!change values
        width: regWidth * 350, //!!change values
        // borderWidth: regWidth * 2,
        padding: regWidth * 10,
        margin: regWidth * 3,
        backgroundColor: "#BEBEBE",
    },
    maintitle: {
        fontSize: 30,
        color: "black",
        marginRight: regWidth * 200,
        marginTop: regHeight * 20,
        fontWeight: "bold",
    },
    imageContainer: { 
        marginTop: regHeight * 20,
    },

})
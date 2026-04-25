import { settings } from '@/constants/data';
import icons from '@/constants/icons';
import images from '@/constants/images';
import { logout } from '@/lib/appwrite';
import { useGlobalContext } from '@/lib/global-provider';
import React from 'react';
import { Alert, Image, ImageSourcePropType, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SettingsItemProps {
    icon : ImageSourcePropType;
    title : string;
    onpress ?: () => void;
    textStyle ?:any;
    showArrow ?:boolean
}

const SettingsItems = ({icon ,title , onpress,textStyle,showArrow=true}
    : SettingsItemProps) => (
    <TouchableOpacity onPress={onpress} className='flex flex-row items-center justify-between py-3'>
        <View>
            <Image source={icon} className='size-6'/>
            <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>{title} </Text>
        </View>

        {showArrow && <Image source={icons.rightArrow} className='size-6'/>}
    </TouchableOpacity>
)

const Profile = () => {

    const {user ,refetch} = useGlobalContext();


    const handleLogout = async () => {
        const result = await logout();

        if(result){
            Alert.alert('success',"you have succesfully loged out!");

            refetch();
        }else{
            Alert.alert("error","error while logging in !");
        }
    };

    return (
       <SafeAreaView className='h-full bg-white'>
        <ScrollView
         showsVerticalScrollIndicator={false}
         contentContainerClassName='pb-32 px-7'>

            <View className='flex flex-row items-center justify-between mt-2'>
                <Text className='text-xl font-rubik-bold'> Profile</Text>
                <Image source={icons.bell} className='size-6'/> 
            </View>

            <View className='flex-row justify-center flex mt-5'>
                <View className='flex flex-col items-center relative mt-5'>
                    <Image source={{uri:user?.avatar}} 
                    className='size-36 relative rounded-full'/>
                    
                    <TouchableOpacity className='absolute size-16 bottom-2 right-20'>
                        <Image source={icons.edit} className='size-10'></Image>
                    </TouchableOpacity>

                    <Text className='text-2xl font-rubik-bold mt-1'>{user?.name}</Text>
                    
                </View>
            </View>

            <View className='flex flex-col mt-10'>
                <SettingsItems icon={icons.calendar} title='My Bookings' />
                 <SettingsItems icon={icons.wallet} title='Payments' />
            </View>

            <View className='flex flex-col mt-5 border-t pt-5 border-primary-200'> 
                {settings.slice(2).map((item,index) => (
                    <SettingsItems key={index} {...item}/>
                ))}

            </View>
            <View className='flex flex-col mt-10'>
                <SettingsItems icon={icons.logout} title='Logout' textStyle="text-danger" showArrow={false} onpress={handleLogout} />
                 
            </View>


        </ScrollView>
        
       </SafeAreaView>
    );
}


export default Profile;

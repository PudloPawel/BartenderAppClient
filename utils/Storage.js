import AsyncStorage from "@react-native-async-storage/async-storage";

export const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key)
        if (value !== null) {
            return value
        }
    } catch (e) {
        return "error"
    }
}
export const storeData = async (value, key) => {
    try {
        await AsyncStorage.setItem(key, value)
    } catch (e) {
    }
}

import { PermissionsAndroid } from 'react-native';
import DocumentPicker from 'react-native-document-picker';

export const pickVideoWithPermission = async () => {
  try {
    const permissionStatus = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
    );
    if (!permissionStatus) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your storage to pick a video.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission denied');
        return null;
      }
    }

    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.video],
    });

    if (res && res[0].uri) {
      return res[0].uri;
    }
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      console.log('User cancelled the picker');
    } else {
      console.error(err);
    }
    return null;
  }
};

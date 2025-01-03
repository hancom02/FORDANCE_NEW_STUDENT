import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/FontAwesome';

const VideoPlayer = ({ uri, visible, setVisible }) => {
    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
        // Thiết lập fullscreen thành true khi visible thay đổi và visible là true
        if (visible) {
            setFullscreen(true);
        }
    }, [visible]);

    const handleClose = () => {
        setVisible(false);
        setFullscreen(false); // Reset fullscreen khi đóng video
    };

    const handleFullscreen = () => {
        setFullscreen(!fullscreen);
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible}>
            <View style={styles.container}>
                <Video
                    source={{ uri }}
                    style={fullscreen ? styles.fullscreenVideo : styles.video}
                    resizeMode="contain"
                    paused={false}
                    controls={true}
                />
                <View style={styles.closeButton}>
                    <TouchableOpacity onPress={handleClose}>
                        <Icon name="close-outline" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
    },
    video: {
        width: width,
        height: height,
    },
    fullscreenVideo: {
        width: width,
        height: height / 2, // Chiều cao khi ở chế độ toàn màn hình
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
    fullscreenButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
});

export default VideoPlayer;

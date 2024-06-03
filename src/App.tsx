import { useCallback, useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native'
import { addTask, connectToDatabase, getTasks, initDatabase } from './utils/db'

export const App = () => {

    const [title, setTitle] = useState('')
    const [tasks, setTasks] = useState([])
    const [error, setError] = useState<string | null>(null)

    const loadData = useCallback(async () => {
        try {
          await initDatabase()
        } catch (error) {
          console.error(error)
        }
      }, [])

      const getData = async () => {
        const db = await connectToDatabase();
        const tasksFromDB = await getTasks(db);
        setTasks(tasksFromDB);
      }

      const handleTitleChange = (title: string) => {
        setTitle(title);
      }

      const createTask = async() => {
        if(title === ""){
            setError("A title for task is required");
            return;
        }
        try {
            const db = await connectToDatabase();
            await addTask(db, title)
            Alert.alert(
                'Success',
                'Task created!',
                [
                    {
                        text: 'OK!',
                        onPress: () => console.log('Si se creo!')
                    }
                ],
                {
                    cancelable: false
                }
            )
            db.close();
        } catch (error: any) {
            setError(`An error occurred saving the task: ${error.message}`)
        }
      }

      const Item = ({item}: any) => (
          <Text style={[styles.title]}>{item.title}</Text>
      );

      const renderItem = ({item}: {item: any}) => {
        return (
          <Item
            item={item}
          />
        );
      };

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        getData();
    }, [getData])
    

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Ingresar titulo"
        style={styles.input}
        value={title}
        onChangeText={title => handleTitleChange(title)}
      />
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          createTask();
        }}>
        <Text style={styles.btnText}>Save Title</Text>
      </TouchableOpacity>
      <View style={{height: 20}}/>
      <FlatList data={tasks} renderItem={renderItem} keyExtractor={(item: any) => item.id}/>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    input: {
      width: '80%',
      height: 50,
      borderRadius: 10,
      borderWidth: 0.3,
      alignSelf: 'center',
      paddingLeft: 20,
      marginTop: 100,
    },
    addBtn: {
      backgroundColor: 'purple',
      width: '80%',
      height: 50,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30,
      alignSelf: 'center',
    },
    btnText: {
      color: '#fff',
      fontSize: 18,
    },
    title: {
        color: 'black'
    }
  });
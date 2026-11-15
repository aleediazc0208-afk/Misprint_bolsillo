import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';

const CATEGORIAS = [
  { nombre: 'Análisis', color: '#0284c7' },
  { nombre: 'Diseño', color: '#0284c7' },
  { nombre: 'Código', color: '#0284c7' },
];

const infoCategoria = (nombre) => CATEGORIAS.find((c) => c.nombre === nombre);

export default function App() {

  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState('Análisis');
  const [tareas, setTareas] = useState([]); 
  const [error, setError] = useState('');

  
  const agregarTarea = () => {
    if (titulo.trim() === '') {
      setError(' Escribe un título para poder agregar la tarea.');
      Alert.alert('Advertencia', 'Escribe un título para poder agregar la tarea.');
      return;
    }
    const nueva = {
      id: Date.now().toString(),
      titulo: titulo.trim(),
      categoria: categoria,
      estado: 'Pendiente',
    };
    setTareas([nueva, ...tareas]);
    setTitulo('');
    setError('');
  };

  
  const cambiarEstado = (id) => {
    setTareas(
      tareas.map((t) =>
        t.id === id
          ? { ...t, estado: t.estado === 'Pendiente' ? 'Completada' : 'Pendiente' }
          : t
      )
    );
  };

  
  const eliminarTarea = (id) => {
    setTareas(tareas.filter((t) => t.id !== id));
  };


  const total = tareas.length;
  const completadas = tareas.filter((t) => t.estado === 'Completada').length;
  const pendientes = total - completadas;
  const porcentaje = total === 0 ? 0 : Math.round((completadas / total) * 100);

  
  const renderTarea = ({ item }) => {
    const hecha = item.estado === 'Completada';
    const cat = infoCategoria(item.categoria);
    return (
      <View style={[styles.card, hecha && styles.cardHecha]}>
        <View style={styles.cardTop}>
          <View style={[styles.catBadge, { borderColor: cat.color }]}>
            <Text style={[styles.catBadgeTxt, { color: cat.color }]}>{item.categoria}</Text>
          </View>
          <View style={[styles.estadoBadge, hecha ? styles.estadoOk : styles.estadoPend]}>
            <Text style={[styles.estadoTxt, { color: hecha ? '#052e16' : '#451a03' }]}>
              {hecha ? '✓ Completada' : '⏳ Pendiente'}
            </Text>
          </View>
        </View>

        <Text style={styles.cardTitulo}>{item.titulo}</Text>

        <View style={styles.cardAcciones}>
          <TouchableOpacity
            style={[styles.btnAccion, hecha ? styles.btnDeshacer : styles.btnCompletar]}
            onPress={() => cambiarEstado(item.id)}
          >
            <Text style={styles.btnAccionTxt}>
              {hecha ? '↩ Marcar pendiente' : '✓ Completar'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnEliminar} onPress={() => eliminarTarea(item.id)}>
            <Text style={styles.btnEliminarTxt}>🗑 Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  
  const encabezado = (
    <View>
      
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTxt}>MD</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.appNombre}>Mi Sprint ADSO</Text>
          <Text style={styles.headerTxt}>Michell Alexandra Diaz Correa </Text>
            <Text style={styles.headerTxt}>TECNÓLOGO EN ANÁLISIS Y DESARROLLO DE SOFTWARE</Text>
          <Text style={styles.headerTxt}>Ficha 3409609</Text>
        </View>
      </View>

      
      <View style={styles.resumen}>
        <View style={styles.resumenFila}>
          <View style={styles.resumenItem}>
            <Text style={styles.resumenNum}>{total}</Text>
            <Text style={styles.resumenLbl}>Total</Text>
          </View>
          <View style={styles.separador} />
          <View style={styles.resumenItem}>
            <Text style={[styles.resumenNum, { color: '#b45309' }]}>{pendientes}</Text>
            <Text style={styles.resumenLbl}>Pendientes</Text>
          </View>
          <View style={styles.separador} />
          <View style={styles.resumenItem}>
            <Text style={[styles.resumenNum, { color: '#15803d' }]}>{completadas}</Text>
            <Text style={styles.resumenLbl}>Completadas</Text>
          </View>
        </View>
        <View style={styles.barraFondo}>
          <View style={[styles.barraRelleno, { width: `${porcentaje}%` }]} />
        </View>
        <Text style={styles.porcentaje}>{porcentaje}% del sprint completado</Text>
      </View>

      
      <View style={styles.form}>
        <Text style={styles.formTitulo}>Nueva tarea</Text>
        <TextInput
          style={[styles.input, error !== '' && styles.inputError]}
          placeholder="¿Qué hay que hacer?"
          placeholderTextColor="#6b7280"
          value={titulo}
          onChangeText={(texto) => {
            setTitulo(texto);
            if (error) setError('');
          }}
        />
        {error !== '' && <Text style={styles.error}>{error}</Text>}

        <View style={styles.categorias}>
          {CATEGORIAS.map((c) => {
            const activa = categoria === c.nombre;
            return (
              <TouchableOpacity
                key={c.nombre}
                style={[
                  styles.chip,
                  activa && { backgroundColor: c.color, borderColor: c.color },
                ]}
                onPress={() => setCategoria(c.nombre)}
              >
                <Text style={[styles.chipTxt, activa && { color: '#ffffff' }]}>{c.nombre}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.btnAgregar} onPress={agregarTarea}>
          <Text style={styles.btnAgregarTxt}>＋ Agregar tarea</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.listaTitulo}>Tablero de tareas</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      
      <FlatList
        data={tareas}
        keyExtractor={(item) => item.id}
        renderItem={renderTarea}
        ListHeaderComponent={encabezado}
        ListEmptyComponent={
          <View style={styles.vacioBox}>
            <Text style={styles.vacio}>Todavía no hay tareas registradas.</Text>
          </View>
        }
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.lista}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e3e6ec' },
  lista: { paddingHorizontal: 16, paddingTop: 50, paddingBottom: 40 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#efeefc',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#727275',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2d2d2f',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarTxt: { color: '#f2eeee', fontSize: 20, fontWeight: 'bold' },
  appNombre: { color: '#211f1f', fontSize: 22, fontWeight: '800' },
  headerTxt: { color: '#131313', fontSize: 13, marginTop: 1 },

  
  resumen: {
    backgroundColor: '#e4e9f0',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#c4c9d1',
  },
  resumenFila: { flexDirection: 'row', alignItems: 'center' },
  resumenItem: { flex: 1, alignItems: 'center' },
  resumenNum: { fontSize: 28, fontWeight: '800', color: '#232425' },
  resumenLbl: { fontSize: 12, color: '#1a1b1c', marginTop: 2 },
  separador: { width: 1, height: 36, backgroundColor: '#9ca3af' },
  barraFondo: {
    height: 8,
    backgroundColor: '#b8bcc4',
    borderRadius: 4,
    marginTop: 14,
    overflow: 'hidden',
  },
  barraRelleno: { height: 8, backgroundColor: '#272827', borderRadius: 4 },
  porcentaje: { color: '#212224', fontSize: 12, marginTop: 6, textAlign: 'center' },

  
  form: {
    backgroundColor: '#e0e3e7',
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#c4c9d1',
  },
  formTitulo: { color: '#1f2023', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  input: {
    backgroundColor: '#f3f4f7',
    color: '#111827',
    borderWidth: 1.5,
    borderColor: '#202122',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
  },
  inputError: { borderColor: '#dc2626' },
  error: { color: '#b91c1c', marginTop: 6, fontSize: 13 },
  categorias: { flexDirection: 'row', flexWrap: 'wrap', marginVertical: 12 },
  chip: {
    borderWidth: 1.5,
    borderColor: '#0f0f10',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 6,
  },
  chipTxt: { color: '#171819', fontWeight: '700', fontSize: 13 },
  btnAgregar: {
    backgroundColor: '#252528',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnAgregarTxt: { color: '#fff', fontWeight: '800', fontSize: 16 },

  listaTitulo: { color: '#1f2023', fontSize: 18, fontWeight: '800', marginBottom: 10 },

  
  card: {
    backgroundColor: '#f3f4f7',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#c4c9d1',
  },
  cardHecha: {
    backgroundColor: '#dcfce7',
    borderColor: '#22c55e',
    shadowColor: '#22c55e',
    shadowOpacity: 0.9,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  catBadge: {
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  catBadgeTxt: { fontSize: 12, fontWeight: '700' },
  estadoBadge: { borderRadius: 10, paddingVertical: 4, paddingHorizontal: 10 },
  estadoOk: { backgroundColor: '#4ade80' },
  estadoPend: { backgroundColor: '#fbbf24' },
  estadoTxt: { fontSize: 12, fontWeight: '800' },
  cardTitulo: { color: '#111827', fontSize: 17, fontWeight: '700', marginVertical: 12 },
  cardAcciones: { flexDirection: 'row' },
  btnAccion: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 8,
  },
  btnCompletar: { backgroundColor: '#16a34a' },
  btnDeshacer: { backgroundColor: '#475569' },
  btnAccionTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
  btnEliminar: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#dc2626',
    alignItems: 'center',
  },
  btnEliminarTxt: { color: '#dc2626', fontWeight: '700', fontSize: 13 },

  
  vacioBox: { alignItems: 'center', paddingVertical: 30 },
  vacio: { color: '#4b5563', fontSize: 15 },
});
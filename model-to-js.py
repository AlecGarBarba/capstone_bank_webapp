#keras thingy

import tensorflowjs as tfjs
from keras.models import Sequential
from keras.layers import Dense, Dropout
from tensorflow.keras.models import load_model

mdl = load_model(r'bank_model.h5')
mdl.summary()
print("model loaded")
tfjs.converters.save_keras_model(mdl, 'Capstone/bank_classifier_js_model.json')
print("chaile")
tfjs.converters.save_keras_model(mdl, "tfjsmodel")
print("conversion succesful!")



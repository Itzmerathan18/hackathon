"""
Minimal training script using TensorFlow + transfer learning for plant disease image classification.
Directory structure expected:
  dataset/
    train/
      classA/
      classB/
      ...
    val/
      classA/
      classB/

Instructions:
- Download a Kaggle dataset (see README section) and arrange data into the structure above.
- Create a Python virtualenv and install requirements from requirements.txt.
- Run: python train.py --data_dir ./dataset --epochs 10 --batch_size 32

This script creates a simple EfficientNetB0 transfer learning pipeline and saves the model to `saved_model/`.
"""

import argparse
import os
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers


def make_data_loaders(data_dir, img_size=(224, 224), batch_size=32):
    train_ds = tf.keras.preprocessing.image_dataset_from_directory(
        os.path.join(data_dir, "train"),
        image_size=img_size,
        batch_size=batch_size,
    )
    val_ds = tf.keras.preprocessing.image_dataset_from_directory(
        os.path.join(data_dir, "val"),
        image_size=img_size,
        batch_size=batch_size,
    )
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.prefetch(buffer_size=AUTOTUNE)
    return train_ds, val_ds


def build_model(num_classes, img_size=(224, 224)):
    base_model = tf.keras.applications.EfficientNetB0(
        include_top=False, input_shape=(*img_size, 3), weights="imagenet"
    )
    base_model.trainable = False
    inputs = keras.Input(shape=(*img_size, 3))
    x = tf.keras.applications.efficientnet.preprocess_input(inputs)
    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D()(x)
    x = layers.Dropout(0.3)(x)
    outputs = layers.Dense(num_classes, activation="softmax")(x)
    model = keras.Model(inputs, outputs)
    model.compile(
        optimizer=keras.optimizers.Adam(1e-3),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


def main(args):
    train_ds, val_ds = make_data_loaders(args.data_dir, img_size=(args.img_size, args.img_size), batch_size=args.batch_size)
    class_names = train_ds.class_names
    print("Classes:", class_names)
    model = build_model(len(class_names), img_size=(args.img_size, args.img_size))

    callbacks = [
        tf.keras.callbacks.ModelCheckpoint("saved_model/best_model.h5", save_best_only=True),
        tf.keras.callbacks.EarlyStopping(patience=4, restore_best_weights=True),
    ]

    model.fit(train_ds, validation_data=val_ds, epochs=args.epochs, callbacks=callbacks)
    os.makedirs("saved_model", exist_ok=True)
    model.save("saved_model/final_model")
    print("Saved trained model to saved_model/")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data_dir", type=str, required=True)
    parser.add_argument("--epochs", type=int, default=10)
    parser.add_argument("--batch_size", type=int, default=32)
    parser.add_argument("--img_size", type=int, default=224)
    args = parser.parse_args()
    main(args)

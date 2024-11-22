from pythonMySQL import connection  
import dlib
import numpy as np
import os
import pickle
import sys
import faulthandler
faulthandler.enable() # For better error Handling

def get_image_by_prefix(directory, prefix): # function Load the image of the person you want to recognize
    files = os.listdir(directory)
    for file in files:
        if file.startswith(prefix):
            return os.path.join(directory, file)
    return None  # Return None if image is not found
  
def encodeStudent(sid):
    sidImageLocation = get_image_by_prefix( os.path.join(os.getcwd() , './studentImages'),sid)
    if not sidImageLocation:
        sys.stderr.write(f"No image found for student with ID: {sid}")
        return

    print("Image found, processing...")
    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor("./shape_predictor_68_face_landmarks.dat")
    face_recognizer = dlib.face_recognition_model_v1("./dlib_face_recognition_resnet_model_v1.dat")
    img = dlib.load_rgb_image(sidImageLocation)
    faces = detector(img)
    print(len(faces))
    if len(faces) == 1:
        for face in faces:
                shape = predictor(img, face)
                embedding = face_recognizer.compute_face_descriptor(img, shape)
                cursor = connection.cursor()
                #print(embedding)
                query = "UPDATE Students SET encoding = %s WHERE Email = %s"
                identifier = sid
                encoding = np.array(embedding)
                encoding_bytes = pickle.dumps(encoding)
                #print(pickle.loads(encoding_bytes))
                try:
                    cursor.execute(query, (encoding_bytes,identifier))
                    connection.commit()
                    print("Student image has encoded and data inserted successfully!")
                except Exception as e:
                    print("Error:", e)
                cursor.close()
    elif(len(faces) < 1):
         sys.stderr.write("No face found ! ! ! Please upload a latest HD Image of yours")
    else:
         sys.stderr.write("Multiple faces found during face encoding ! ! ! Please upload photo with single face of yours")

sid = input()
encodeStudent(sid)

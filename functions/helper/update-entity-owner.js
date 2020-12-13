const DIALOGFLOW_PROJECTID = "antowner-tovppp";
const DIALOGFLOW_SERVICE_ACCOUNT = "ant-owner-dialogflow-service-account.json";

const dialogflow = require("dialogflow");

const entities = new dialogflow.v2beta1.EntityTypesClient({
  DIALOGFLOW_PROJECTID,
  keyFilename: DIALOGFLOW_SERVICE_ACCOUNT,
});

function getEntitiesList() {
  return new Promise((resolve, reject) => {
    entities
      .listEntityTypes({ parent: `projects/${DIALOGFLOW_PROJECTID}/agent` })
      .then((response) => {
        resolve(response);
        return;
      })
      .catch((err) => {
        console.log("An error occured in getting list of all entities");
        reject(err);
      });
  });
}

function insertWithinEntity(courseName, entityList) {
  return new Promise((resolve, reject) => {
    let entity = {
      synonyms: [courseName],
      value: courseName,
    };
    entityList.entities.push(entity);
    let updateSchema = {
      entityType: entityList,
    };
    entities
      .updateEntityType(updateSchema)
      .then((response) => {
        resolve(response);
        return;
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function insertIfNewProgramAdded(entityList, updatedCourseName) {
  return new Promise((resolve, reject) => {
    let courses = entityList.entities;
    for (let course of courses) {
      if (course.value === updatedCourseName) {
        // Ignore the insertion as program is already defined in entities
        return reject("No Changes Required");
      }
    }
    return insertWithinEntity(updatedCourseName, entityList)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

exports.updateEntityOwner = async (courseName) => {
  try {
    if (courseName) {
      return await getEntitiesList()
        .then(async (entityList) => {
          let courses = entityList[0][0];
          await insertIfNewProgramAdded(courses, courseName);
        })
        .catch((err) => console.log(err));
    } else {
      console.log(`No Changes In Dialogflow`);
    }
  } catch (error) {
    console.log(error);
  }
};

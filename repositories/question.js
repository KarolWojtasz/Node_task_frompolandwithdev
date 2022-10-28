const { readFile } = require('fs/promises')
const uuid = require('uuid');
const { writeFile } = require('fs/promises')

const makeQuestionRepository = fileName => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)
    return questions
  }

  const getQuestionById = async questionId => {
    const allQuestions = await getQuestions()
    const question = allQuestions.find(element => element.id == questionId)
    if (question == undefined)
      return {}
    return question
  }
  const addQuestion = async question => {
    const questions = await getQuestions()
    if (question.hasOwnProperty('author') && question.hasOwnProperty('summary') && question.hasOwnProperty('answers')) {
      question.id = uuid.v4()
      questions.push(question)
      await writeFile(fileName, JSON.stringify(questions), { encoding: 'utf-8' })
      return { "id": question.id };
    } else
      return {};
  }
  const getAnswers = async questionId => {
    const answers = await getQuestionById(questionId).then((value) => {
      return value.answers
    });
    return answers
  }
  const getAnswer = async (questionId, answerId) => {
    const answers = await getQuestionById(questionId).then((value) => {
      return value.answers
    });
    const answer = await answers.find(element => element.id == answerId)
    if (answer == undefined)
      return {}
    return answer
  }
  const addAnswer = async (questionId, answer) => {
    if (answer.hasOwnProperty('author') && answer.hasOwnProperty('summary')) {
      const questions = await getQuestions()
      const question = await getQuestionById(questionId).then((value) => {
        return value
      });
      answer.id = uuid.v4();
      questions.forEach(function (item) {
        if (item.id == question.id) {
          console.log(item.answers)
          item.answers.push(answer);
        }
      });
      await writeFile(fileName, JSON.stringify(questions), { encoding: 'utf-8' })
      return { "id": answer.id };
    } else return {}
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }

import chai from 'chai'
import walkInThePark from '../src/q1'
import Q3 from '../src/q3'

const assert = chai.assert

describe('Q1 function - Walk In The Park', () => {

  const answer = walkInThePark()

  it('should return typeof string', () => {
    assert.equal(typeof answer, 'string')
  })

  it('should return 100 items', () => {
    assert.equal(answer.split(' ').length, 100)
  })

})

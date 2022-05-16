import { convertPlaceholder, generateAutoNumber, getNextNumber } from './utils'
import Mockdate from 'mockdate'

beforeEach(() => {
  Mockdate.set('2006-01-02 15:04:05')
})

afterEach(() => {
  Mockdate.reset()
})

describe('test parse placeholder', () => {
  it('should return 2006', () => {
    expect(convertPlaceholder('[yyyy]')).toBe('2006')
    expect(convertPlaceholder('[YYYY]')).toBe('2006')
  })
  it('should return 01', () => {
    expect(convertPlaceholder('[mm]')).toBe('01')
    expect(convertPlaceholder('[MM]')).toBe('01')
  })
  it('should return 02', () => {
    expect(convertPlaceholder('[dd]')).toBe('02')
    expect(convertPlaceholder('[DD]')).toBe('02')
  })
  it('should return CATEX-2006-01-02', () => {
    expect(convertPlaceholder('CATEX-[yyyy]-[mm]-[dd]')).toBe('CATEX-2006-01-02')
  })
})

describe('test generate auto number', () => {
  it('should return CATEX-00001', () => {
    expect(generateAutoNumber('CATEX-', 1, 5)).toBe('CATEX-00001')
  })
  it('should return CATEX-123456', () => {
    expect(generateAutoNumber('CATEX-', 123456, 5)).toBe('CATEX-123456')
  })
})

describe('test get next number', () => {
  it('should return 1', () => {
    expect(getNextNumber(null, 1)).toBe(1)
  })
  it('should return 101', () => {
    expect(getNextNumber(100, 10)).toBe(101)
  })
  it('should return 11', () => {
    expect(getNextNumber(2, 10)).toBe(11)
  })
})

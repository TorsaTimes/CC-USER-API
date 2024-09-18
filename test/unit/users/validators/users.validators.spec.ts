import { UserValidator } from '../../../../src/app/modules/users/validators/users.validator';
import { UserDto } from '../../../../src/app/modules/users/dto/user.dto';
import { validateSync } from 'class-validator';

// Mocking des gesamten class-validator Moduls
jest.mock('class-validator', () => ({
  ...jest.requireActual('class-validator'),
  validateSync: jest.fn(),
}));

(validateSync as jest.Mock).mockReturnValue([]);

describe('UserValidator', () => {
  let validator: UserValidator;

  beforeEach(() => {
    validator = new UserValidator();
  });

  describe('validateUserDto', () => {
    it('should validate a valid UserDto and not throw an error', () => {
      const validUserDto: UserDto = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
      };

      // Simuliert erfolgreiche Validierung
      // Mock validateSync, um die Validierungsfehler zurückzugeben
      (validateSync as jest.Mock).mockReturnValue([]);

      expect(() => validator.validateUserDto(validUserDto)).not.toThrow();
    });

    it('should throw an error if UserDto has invalid fields', () => {
      const invalidUserDto: UserDto = {
        id: null, // ungültige ID
        name: '',
        email: 'invalid-email',
      };

      // Definierung der erwarteten Validierungsfehler
      const validationErrors = [
        {
          property: 'id',
          constraints: { isInt: 'ID must be an integer' },
        },
        {
          property: 'name',
          constraints: { isNotEmpty: 'Name is required' },
        },
        {
          property: 'email',
          constraints: { isEmail: 'Invalid email format' },
        },
      ];

      (validateSync as jest.Mock).mockReturnValue(validationErrors);

      // Erwartung: Der Validator sollte eine Ausnahme mit der Nachricht 'Validation failed' werfen
      expect(() => validator.validateUserDto(invalidUserDto)).toThrow(
        'Validation failed',
      );
    });
    it('should throw an error if null is passed as UserDto', () => {
      // Simuliere des Falls, dass null übergeben wird
      expect(() => validator.validateUserDto(null as any)).toThrow(
        'Validation failed',
      );
    });

    it('should throw an error if undefined is passed as UserDto', () => {
      // Simuliert des Falls, dass undefined übergeben wird
      expect(() => validator.validateUserDto(undefined as any)).toThrow(
        'Validation failed',
      );
    });
    it('should throw an error when required fields are missing in UserDto', () => {
      const incompleteUserDto: UserDto = {
        id: 1, // ID ist vorhanden, aber Name und Email fehlen
        name: undefined as any,
        email: undefined as any,
      };

      const validationErrors = [
        {
          property: 'name',
          constraints: { isNotEmpty: 'Name is required' },
        },
        {
          property: 'email',
          constraints: { isEmail: 'Invalid email format' },
        },
      ];

      (validateSync as jest.Mock).mockReturnValue(validationErrors);

      expect(() => validator.validateUserDto(incompleteUserDto)).toThrow(
        'Validation failed',
      );
    });
  });

  describe('validateUserDtos', () => {
    it('should validate a list of valid UserDtos and not throw an error', () => {
      const validUserDtos: UserDto[] = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
      ];

      (validateSync as jest.Mock).mockReturnValue([]);

      expect(() => validator.validateUserDtos(validUserDtos)).not.toThrow();
    });

    it('should throw an error when any UserDto in the list is invalid', () => {
      const userDtos: UserDto[] = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
        { id: null, name: '', email: 'invalid-email' }, // Dieser DTO ist ungültig
      ];

      const validationErrors = [
        { property: 'id', constraints: { isInt: 'ID must be an integer' } },
        { property: 'name', constraints: { isNotEmpty: 'Name is required' } },
        { property: 'email', constraints: { isEmail: 'Invalid email format' } },
      ];

      (validateSync as jest.Mock).mockReturnValue([]);
      (validateSync as jest.Mock).mockReturnValue(validationErrors);

      expect(() => validator.validateUserDtos(userDtos)).toThrow(
        'Validation failed',
      );
    });
    it('should not throw an error when an empty list of UserDtos is provided', () => {
      const emptyUserDtos: UserDto[] = [];

      (validateSync as jest.Mock).mockReturnValue([]);

      expect(() => validator.validateUserDtos(emptyUserDtos)).not.toThrow();
    });
    it('should throw an error when null is passed in the list of UserDtos', () => {
      const userDtos = [
        { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
        null,
      ];

      (validateSync as jest.Mock).mockImplementation((userDto) => {
        if (userDto === null) {
          throw new Error('Validation failed: null value');
        }
        return [];
      });

      expect(() => validator.validateUserDtos(userDtos)).toThrow(
        'Validation failed',
      );
    });
  });
});

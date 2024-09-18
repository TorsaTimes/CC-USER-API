import { UserMapper } from '../../../../src/app/modules/users/mapper/user.mapper';
import { UsersService } from '../../../../src/app/modules/users/services/users.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let mockUsers: any[];
  let spyMapper: jest.SpyInstance;

  const mockUserRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  const mockUserValidator = {
    validateUserDtos: jest.fn(),
    validateUserDto: jest.fn(),
  };

  beforeEach(() => {
    // Initialisiert den UsersService mit den gemockten Abhängigkeiten
    service = new UsersService(
      mockUserRepository as any,
      mockUserValidator as any,
    );

    // Initialisiere Testdaten
    mockUsers = [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
    ];

    // Mock für die Methoden des Repositories
    mockUserRepository.findAll.mockReturnValue(mockUsers);
    mockUserRepository.findById.mockReturnValue(mockUsers[0]);

    // SpyOn für UserMapper
    spyMapper = jest.spyOn(UserMapper, 'toDto').mockImplementation((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));

    // SpyOn für den Validator
    jest.spyOn(mockUserValidator, 'validateUserDtos').mockImplementation(() => {
      // Überprüfung der Validierung: Werfe Fehler, wenn name oder email fehlen
      mockUsers.forEach((user) => {
        if (!user.name || !user.email) {
          throw new Error('Validation failed');
        }
      });
    });

    jest
      .spyOn(mockUserValidator, 'validateUserDto')
      .mockImplementation((user) => {
        if (!user.name || !user.email) {
          throw new Error('Validation failed');
        }
      });
  });

  describe('findAllUsers', () => {
    it('should return a list of users when findAll is called', () => {
      const users = service.findAllUsers();
      expect(users).toEqual(mockUsers);
      expect(mockUserRepository.findAll).toHaveBeenCalled();
      expect(spyMapper).toHaveBeenCalledTimes(mockUsers.length);
    });

    it('should throw NotFoundException when no users are found in findAll', () => {
      mockUserRepository.findAll.mockReturnValue([]);

      expect(() => service.findAllUsers()).toThrow(NotFoundException);
    });

    it('should throw an error when users with missing fields are found during findAll', () => {
      mockUsers = [{ id: 1, name: null, email: 'john.doe@example.com' }];
      mockUserRepository.findAll.mockReturnValue(mockUsers);

      expect(() => service.findAllUsers()).toThrow('Validation failed');
    });

    it('should call the repository and perform mapping and validation when findAll is called', () => {
      service.findAllUsers();

      expect(mockUserRepository.findAll).toHaveBeenCalled();
      expect(spyMapper).toHaveBeenCalledWith(mockUsers[0]);
      expect(mockUserValidator.validateUserDtos).toHaveBeenCalled();
    });

    it('should throw an error when validation fails during findAll', () => {
      mockUserValidator.validateUserDtos.mockImplementation(() => {
        throw new Error('Validation failed');
      });

      expect(() => service.findAllUsers()).toThrow('Validation failed');
    });
  });

  describe('findUserById', () => {
    it('should return the correct user when findById is called with a valid ID', () => {
      const user = service.findUserById(1);
      expect(user).toEqual(mockUsers[0]);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
      expect(spyMapper).toHaveBeenCalledWith(mockUsers[0]);
    });

    it('should throw NotFoundException when user is not found and null is returned by findUserById', () => {
      mockUserRepository.findById.mockReturnValue(null);

      expect(() => service.findUserById(1)).toThrow(NotFoundException);
    });

    it('should throw NotFoundException when user is not found and undefined is returned by findUserById', () => {
      mockUserRepository.findById.mockReturnValue(undefined);

      expect(() => service.findUserById(1)).toThrow(NotFoundException);
    });

    it('should throw an error when users with missing fields are found during findById', () => {
      const incompleteUser = {
        id: 1,
        name: null,
        email: 'john.doe@example.com',
      };
      mockUserRepository.findById.mockReturnValue(incompleteUser);

      expect(() => service.findUserById(1)).toThrow('Validation failed');
    });

    it('should throw an error if user has missing fields', () => {
      const incompleteUser = { id: 1, name: undefined, email: undefined };
      mockUserRepository.findById.mockReturnValue(incompleteUser);

      expect(() => service.findUserById(1)).toThrow('Validation failed');
    });

    it('should call the repository and perform mapping and validation when findById is called', () => {
      service.findUserById(1);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(1);
      expect(spyMapper).toHaveBeenCalledWith(mockUsers[0]);
      expect(mockUserValidator.validateUserDto).toHaveBeenCalled();
    });

    it('should throw an error when validation fails during findById', () => {
      mockUserValidator.validateUserDto.mockImplementation(() => {
        throw new Error('Validation failed');
      });

      expect(() => service.findUserById(1)).toThrow('Validation failed');
    });
  });
});

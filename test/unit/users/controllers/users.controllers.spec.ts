import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../../../src/app/modules/users/controllers/users.controller';
import { UsersService } from '../../../../src/app/modules/users/services/users.service';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { ConsoleLogger } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: Partial<UsersService>;
  let mockUsers: any[];
  let mockUser: any;

  // Initialisiert die benötigten Mocks und Testdaten
  beforeEach(async () => {
    // Erstellt Mocks für den UsersService
    usersService = {
      findAllUsers: jest.fn(),
      findUserById: jest.fn(),
    };

    // TestingModule für den Controller und setze die Mocks
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService, // Verwendt den gemockten UsersService
        },
        {
          provide: ConsoleLogger, // Mock für den Logger
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
            verbose: jest.fn(),
          },
        },
      ],
    }).compile();

    // Instanziiert den UsersController
    usersController = module.get<UsersController>(UsersController);

    // Testdaten für die Benutzerliste
    mockUsers = [
      { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane.doe@example.com' },
    ];

    // Testdaten für einen einzelnen Benutzer
    mockUser = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
  });

  // Test für die findAll-Methode des Controllers
  describe('findAll', () => {
    it('should return an array of users when findAll is called', async () => {
      // Simuliert die Rückgabe der Benutzerliste im Service
      (usersService.findAllUsers as jest.Mock).mockReturnValue(mockUsers);

      const result = usersController.findAll();

      // Überprüft, ob das Ergebnis mit den Mock-Daten übereinstimmt
      expect(result).toEqual(mockUsers);
      // Überprüft, ob die Service-Methode aufgerufen wurde
      expect(usersService.findAllUsers).toHaveBeenCalled();
    });

    it('should throw NotFoundException when no users are found in findAll', async () => {
      // Simuliert eine leere Rückgabe vom Service (keine Benutzer gefunden)
      (usersService.findAllUsers as jest.Mock).mockReturnValue([]);

      try {
        usersController.findAll();
      } catch (error) {
        // Überprüft, ob eine NotFoundException geworfen wird
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should return a 404 NotFoundException if user list is not found', async () => {
      // Simuliert, dass der Service eine NotFoundException auslöst
      (usersService.findAllUsers as jest.Mock).mockImplementation(() => {
        throw new NotFoundException('User not found');
      });

      try {
        usersController.findAll();
      } catch (error) {
        // Überprüft, ob die Exception korrekt ist und der HTTP-Status 404 ist
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('User not found');
        expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  // Test für die findById-Methode des Controllers
  describe('findById', () => {
    it('should return a user by ID when findById is called with a valid ID', async () => {
      // Simuliert die Rückgabe eines Benutzers im Service
      (usersService.findUserById as jest.Mock).mockReturnValue(mockUser);

      const result = usersController.findById(1);

      // Überprüft, ob das Ergebnis mit den Mock-Daten übereinstimmt
      expect(result).toEqual(mockUser);
      // Überprüft, ob die Service-Methode mit der richtigen ID aufgerufen wurde
      expect(usersService.findUserById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when user is not found by findById', async () => {
      // Simuliert, dass der Service eine NotFoundException wirft
      (usersService.findUserById as jest.Mock).mockImplementation(() => {
        throw new NotFoundException();
      });

      try {
        usersController.findById(1);
      } catch (error) {
        // Überprüft, ob eine NotFoundException geworfen wird
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('should validate and parse the ID', async () => {
      // Simuliert die Rückgabe eines Benutzers im Service
      (usersService.findUserById as jest.Mock).mockReturnValue(mockUser);

      const result = usersController.findById(1);

      // Überprüft, ob das Ergebnis korrekt zurückgegeben wurde
      expect(result).toEqual(mockUser);
      // Überprüft, ob die Service-Methode mit der korrekten ID aufgerufen wurde
      expect(usersService.findUserById).toHaveBeenCalledWith(1);
    });

    it('should return a 404 NotFoundException if user is not found', async () => {
      // Simuliert, dass der Service eine NotFoundException wirft
      (usersService.findUserById as jest.Mock).mockImplementation(() => {
        throw new NotFoundException('User not found');
      });

      try {
        usersController.findById(1);
      } catch (error) {
        // Überprüft, ob die Exception korrekt ist und der HTTP-Status 404 ist
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('User not found');
        expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });
});

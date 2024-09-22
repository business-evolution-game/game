// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./GameBase.sol";

import "hardhat/console.sol";

abstract contract CellManagement is GameBase {
    // Event for property transactions
    event BusinessPurchased(address player, uint8 positoin);
//    event RentPaid(address from, address to, uint256 amount);


    uint8 public constant TOTAL_STEPS = 34;
    uint8[TOTAL_STEPS+1] public branchCount;

    constructor() {
        initBoard();
    }

    function initBoard() internal{
        uint8 index = 0;
        uint8 step = 0;
        cells[index++]=createCell(index, createPositionValue(step++,0), CellType.START, 0);
        cells[index++]=createCell(index, createPositionValue(step++,0), CellType.UNKNOWN, 0);

        uint8 monopolyIndex=0;
        for(;monopolyIndex<3; monopolyIndex++){
            for(uint8 branch=1; branch<4; branch++){
                cells[index++]=createCell(index, createPositionValue(step,branch), CellType.BUSINESS, uint(10000)+5000*monopolyIndex+5000*(monopolyIndex/3>0?monopolyIndex/3*3:0));
            }
            step++;
        }
        cells[index++]=createCell(index, createPositionValue(step++,0), CellType.UNKNOWN, 0);
        cells[index++]=createCell(index, createPositionValue(step++,0), CellType.UNKNOWN, 0);


        for(;monopolyIndex<6; monopolyIndex++){
            for(uint8 branch=1; branch<4; branch++){
                cells[index++]=createCell(index, createPositionValue(step,branch), CellType.BUSINESS, uint(10000)+5000*monopolyIndex+5000*(monopolyIndex/3>0?monopolyIndex/3*3:0));
            }
            step++;
        }

        cells[index++]=createCell(index, createPositionValue(step++,0), CellType.UNKNOWN, 0);

        cells[index++]=createCell(index, createPositionValue(step,1), CellType.OFFICE, 0);
        cells[index++]=createCell(index, createPositionValue(step++,2), CellType.UNKNOWN, 0);

        for(uint8 i=0; i<5; i++){
            cells[index++]=createCell(index, createPositionValue(step++,0), CellType.UNKNOWN, 0);
        }

        cells[index++]=createCell(index, createPositionValue(step++,0), CellType.TAX, 0);
        cells[index++]=createCell(index, createPositionValue(step++,0), CellType.UNKNOWN, 0);

        for(;monopolyIndex<9; monopolyIndex++){
            for(uint8 branch=1; branch<4; branch++){
                cells[index++]=createCell(index, createPositionValue(step,branch), CellType.BUSINESS, uint(10000)+(5000*monopolyIndex)+(5000*(monopolyIndex/3>0?monopolyIndex/3*3:0)));
            }
            step++;
        }
        //
        cells[index++]=createCell(index, createPositionValue(step++,0), CellType.UNKNOWN, 0);
        cells[index++]=createCell(index, createPositionValue(step++,0), CellType.UNKNOWN, 0);

        for(;monopolyIndex<12; monopolyIndex++){
            for(uint8 branch=1; branch<4; branch++){
                cells[index++]=createCell(index, createPositionValue(step,branch), CellType.BUSINESS, uint(10000)+5000*monopolyIndex+5000*(monopolyIndex/3>0?monopolyIndex/3*3:0));
            }
            step++;
        }

        cells[index++]=createCell(index, createPositionValue(step++,0), CellType.UNKNOWN, 0);
        cells[index++]=createCell(index, createPositionValue(step++,0), CellType.OFFICE, 0);

        for(uint8 i=0; i<6; i++){
            cells[index++]=createCell(index, createPositionValue(step++,0), CellType.UNKNOWN, 0);
        }
    }
    function createCell(uint8 index, Position position, CellType cellType, uint startPrice) internal returns(Cell memory){
        Cell memory cell = Cell({
            position:position,
            cellType:cellType,
            startPrice:startPrice,
            rentPrice:startPrice/20,
            level:0,
            owner:address(0)
        });
        cellIndexes[position] = index;
        branchCount[Position.unwrap(position)&0x3F]++;
        return cell;
    }

    function getStepBranchesCount(uint8 step) public returns(uint8){
        return branchCount[step];
    }

    function getPaymentValue(address playerAddress, Position position) internal returns(uint){
        //TODO: refactor to allow custom agreement
        return cells[cellIndexes[position]].rentPrice;
    }

    // Buy property function
    function buyBusiness() external onlyStartedGame onlyPlayer onlyActivePlayer{
        Player memory player = players[msg.sender];
        Cell storage cell = cells[cellIndexes[player.position]];

        require(cell.cellType == CellType.BUSINESS, "You are not on a business cell, so you can't bye it.");
        require(cell.owner == address(0), "Property is already owned.");
        require(int(cell.startPrice) < player.balance, "Insufficient balance to buy this business.");


        player.balance -= int(cell.startPrice);
        cell.owner = msg.sender;

        emit BusinessPurchased(msg.sender, Position.unwrap(player.position));
    }
//
//    // Pay rent function
//    function payRent(uint8 _propertyId) internal {
//        Property storage prop = properties[_propertyId];
//        Player storage player = players[msg.sender];
//
//        require(prop.isOwned, "Property is not owned by any player.");
//        require(prop.owner != msg.sender, "You own this property.");
//        require(player.balance >= prop.rent, "Insufficient balance to pay rent.");
//
//        uint256 rentToPay = prop.rent;
//
//        player.balance -= rentToPay;
//        players[prop.owner].balance += rentToPay;
//
//        emit RentPaid(msg.sender, prop.owner, rentToPay);
//    }
}
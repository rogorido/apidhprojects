#!/bin/bash

DB=dhprojects

dropdb ${DB}
createdb ${DB}

psql -d ${DB} -f sqls/maintable.sql

